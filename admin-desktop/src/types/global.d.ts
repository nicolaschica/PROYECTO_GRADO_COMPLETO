export {};

declare global {
  interface Window {
    api: {
      login: (email: string, password: string) => Promise<any>;
      getReservas: (params?: Record<string, any>) => Promise<any>;
      updateReserva: (id: number, data: any) => Promise<any>;
      deleteReserva: (id: number) => Promise<any>;
    };
  }
}
