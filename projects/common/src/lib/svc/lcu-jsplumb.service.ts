import { Injectable } from '@angular/core';

import { jsPlumbToolkit, Surface } from 'jsplumbtoolkit';
import { Observable } from 'rxjs';

@Injectable()
export class LCUjsPlumbService {
  //  Fields
  protected miniviews: { [id: string]: any };

  protected surfaces: { [id: string]: Surface };

  protected toolkits: { [id: string]: jsPlumbToolkit };

  protected workQueues: { [id: string]: Function[] };

  //  Constructors
  constructor() {
    this.miniviews = {};

    this.surfaces = {};

    this.toolkits = {};

    this.workQueues = {};
  }

  //  API Methods
  public AddMiniview(surfaceId: string, container: any) {
    this.GetSurface(surfaceId).subscribe(surface => {
      const miniview = surface.createMiniview({
        container: container
      });

      surface.getToolkit().bind('dataLoadEnd', () => {
        setTimeout(miniview.invalidate, 0);
      });

      surface.getToolkit().bind('nodeAdded', (params: any) => {
        setTimeout(function() {
          miniview.invalidate(params.node.id);
        }, 0);
      });

      this.miniviews[surfaceId] = miniview;
    });
  }

  public AddSurface(id: string, surface: Surface) {
    this.surfaces[id] = surface;

    surface._ngId = id;

    if (this.workQueues[id]) {
      for (let i = 0; i < this.workQueues[id].length; i++) {
        try {
          this.workQueues[id][i](surface);
        } catch (e) {
          if (typeof console !== 'undefined') {
            console.log('Cannot create component ' + e);
          }
        }
      }
    }

    delete this.workQueues[id];
  }

  public GetSurface(id: string) {
    return Observable.create(obs => {
      const surface = this.surfaces[id];

      if (surface) {
        obs.next(surface);
      } else {
        this.workQueues[id] = this.workQueues[id] || [];

        this.workQueues[id].push(obs.next);
      }
    });
  }

  public GetToolkit(id: string, params: any, forceNew?: boolean) {
    if (forceNew || !this.toolkits[id]) {
      this.toolkits[id] = jsPlumbToolkit.newInstance(params || {});
    }

    return this.toolkits[id];
  }
}
