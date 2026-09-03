import { Injectable, signal } from '@angular/core';

interface ConfirmState {
  message: string;
  confirmLabel: string;
  resolve: (value: boolean) => void;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  readonly state = signal<ConfirmState | null>(null);

  confirm(message: string, confirmLabel = 'Confirm'): Promise<boolean> {
    return new Promise(resolve => {
      this.state.set({ message, confirmLabel, resolve });
    });
  }

  respond(result: boolean): void {
    const current = this.state();
    if (!current) {
      return;
    }
    this.state.set(null);
    current.resolve(result);
  }
}
