import React from 'react';
import { StargazeModule } from './StargazeModule.jsx';
import { PlasmaModule } from './PlasmaModule.jsx';
import { PortalModule } from './PortalModule.jsx';
import { GardenModule } from './GardenModule.jsx';
import { HealerModule } from './HealerModule.jsx';
import { GenericModule } from './GenericModule.jsx';

const MODULE_MAP = {
  stargaze: StargazeModule,
  plasma: PlasmaModule,
  portal: PortalModule,
  garden: GardenModule,
  healer: HealerModule,
};

export function ModuleRenderer({ instance }) {
  const ModuleComponent = MODULE_MAP[instance.id] || GenericModule;
  return <ModuleComponent instance={instance} />;
}
