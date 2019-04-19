import { FluxModule } from './FluxModule';
import { FluxStream } from './FluxStream';
import { Status } from '@lcu-ide/common';

export class FluxConfig {
  public Description: string;

  public Deleted?: boolean;

  public Inactive?: boolean;

  public Lookup: string;

  public Modules?: FluxModule[];

  public Name: string;

  public Status?: Status;

  public Streams?: FluxStream[];
}
