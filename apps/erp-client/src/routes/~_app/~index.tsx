import { createFileRoute } from '@tanstack/react-router';

import { useState } from 'react';
import { StockpointCombobox } from './components/stockpoint/StockpointCombobox';

export const Route = createFileRoute('/_app/')({
  component: Component,
});

function Component() {
  const [id, setId] = useState<number | null>(null);

  return <StockpointCombobox setValue={setId} value={id} />;
}
