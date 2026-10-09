import * as React from 'react';

// What Base UI's Field doesn't carry to the control: legacy Field's `id` (the control's id) and `required`.
// Base UI wires the label, aria-describedby and aria-invalid itself.
export interface KoiFieldContextValue {
  id?: string;
  required?: boolean;
}

export const KoiFieldContext = React.createContext<KoiFieldContextValue | null>(null);
