import { Injectable } from '@angular/core';

import { jsPlumbToolkit, Surface } from 'jsplumbtoolkit';

@Injectable()
export class jsPlumbService {
  //  Fields
  protected toolkits = {};

  protected surfaces = {};

  protected miniviews = {};

  protected _workQueues = {};

  //  API Methods
  public AddMiniview(surfaceId: string, params: any) {
    const self = this;

    this.GetSurface(
      surfaceId,
      function(surface: any) {
        const miniview = surface.createMiniview({
          container: params.container
        });
        surface.getToolkit().bind('dataLoadEnd', () => {
          setTimeout(miniview.invalidate, 0);
        });

        surface.getToolkit().bind('nodeAdded', (params: any) => {
          setTimeout(function() {
            miniview.invalidate(params.node.id);
          }, 0);
        });

        self.miniviews[surfaceId] = miniview;
      },
      null
    );
  }

  public AddSurface(id: string, surface: Surface) {
    this.surfaces[id] = surface;

    surface._ngId = id;

    if (this._workQueues[id]) {
      for (let i = 0; i < this._workQueues[id].length; i++) {
        try {
          this._workQueues[id][i][0](surface, this._workQueues[id][i][1]);
        } catch (e) {
          if (typeof console !== 'undefined') {
            console.log('Cannot create component ' + e);
          }
        }
      }
    }

    delete this._workQueues[id];
  }

  public GetToolkit(id: string, params: any) {
    if (!this.toolkits[id]) {
      this.toolkits[id] = jsPlumbToolkit.newInstance(params || {});
    }

    return this.toolkits[id];
  }

  public GetSurface(id: string, callback: Function, _params: any) {
    const surface = this.surfaces[id];

    if (callback) {
      if (surface) {
        callback(surface);
      } else {
        this._workQueues[id] = this._workQueues[id] || [];

        this._workQueues[id].push([callback, _params]);
      }
    } else {
      return surface;
    }
  }
}
