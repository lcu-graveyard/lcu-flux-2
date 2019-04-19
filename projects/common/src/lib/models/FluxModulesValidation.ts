export class FluxModulesValidation {
  public Connection: {
    Incoming: FluxModuleConnectionValidation,
    Outgoing: FluxModuleConnectionValidation
  };
}

export class FluxModuleConnectionValidation {
  public Limit: { [moduleType: string]: number };

  public Types: { [moduleType: string]: string[] };
}
