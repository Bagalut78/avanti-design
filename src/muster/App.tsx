import { DesignFrame } from './DesignFrame';
import { DesignPage } from './DesignPage';

/** Die Musterseite im App-Rahmen. */
export function App() {
  return (
    <DesignFrame>
      <DesignPage />
    </DesignFrame>
  );
}
