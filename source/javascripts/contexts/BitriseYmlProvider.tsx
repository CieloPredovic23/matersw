import { ComponentType, createContext, PropsWithChildren, useEffect, useRef } from 'react';
import { createStore } from 'zustand';
import { BitriseYml, Meta } from '@/models/BitriseYml';
import { ChainedWorkflowPlacement } from '@/models/Workflow';
import BitriseYmlService from '@/models/BitriseYmlService';

type BitriseYmlProviderProps = PropsWithChildren<{
  yml: BitriseYml;
  defaultMeta?: Meta;
  onChange?: (yml: BitriseYml) => void;
}>;

export type BitriseYmlProviderState = {
  yml: BitriseYml;
  defaultMeta?: Meta;

  // Workflow related actions
  deleteWorkflow: (workflowId: string) => void;
  deleteChainedWorkflow: (
    chainedWorkflowIndex: number,
    parentWorkflowId: string,
    placement: ChainedWorkflowPlacement,
  ) => void;
};

type BitriseYmlStore = ReturnType<typeof createBitriseYmlStore>;

const createBitriseYmlStore = (yml: BitriseYml, defaultMeta?: Meta) => {
  return createStore<BitriseYmlProviderState>()((set) => ({
    yml,
    defaultMeta,
    deleteWorkflow(workflowId) {
      return set((state) => {
        return {
          yml: BitriseYmlService.deleteWorkflow(workflowId, state.yml),
        };
      });
    },
    deleteChainedWorkflow(chainedWorkflowIndex, parentWorkflowId, placement) {
      return set((state) => {
        return {
          yml: BitriseYmlService.deleteChainedWorkflow(chainedWorkflowIndex, parentWorkflowId, placement, state.yml),
        };
      });
    },
  }));
};

export const BitriseYmlContext = createContext<BitriseYmlStore | null>(null);

const BitriseYmlProvider = ({ yml, defaultMeta, children, onChange }: BitriseYmlProviderProps) => {
  const store = useRef(createBitriseYmlStore(yml, defaultMeta)).current;

  useEffect(() => {
    const unsubsribe = store.subscribe(({ yml: currentYml }, { yml: previousYml }) => {
      if (onChange && JSON.stringify(currentYml) !== JSON.stringify(previousYml)) {
        onChange(currentYml);
      }
    });

    return unsubsribe;
  }, [store, onChange]);

  return <BitriseYmlContext.Provider value={store}>{children}</BitriseYmlContext.Provider>;
};

export default BitriseYmlProvider;

export const withBitriseYml = (yml: BitriseYml, Component: ComponentType) => {
  return (
    <BitriseYmlProvider yml={yml}>
      <Component />
    </BitriseYmlProvider>
  );
};
