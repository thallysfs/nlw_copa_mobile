//definindo e organizando as minhas rotas
export declare global {
  namespace ReactNavigation {
    interface RootParamList {
      new: undefined;
      polls: undefined;
      find: undefined;
      details: {
        id: string;
      } 
    }
  }
}
