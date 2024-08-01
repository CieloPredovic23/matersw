import { ComponentType, createContext, PropsWithChildren, useEffect, useRef } from 'react';
import { createStore } from 'zustand';
import { BitriseYml, Meta } from '@/models/BitriseYml';
import { ChainedWorkflowPlacement } from '@/models/Workflow';
import BitriseYmlService from '@/models/BitriseYmlService';
import WorkflowService from '@/models/WorkflowService';
import deepCloneSimpleObject from '@/utils/deepCloneSimpleObject';

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
  deleteWorkflowFromChain: (
    workflowId: string,
    chainedWorkflowIndex: number,
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
          yml: BitriseYmlService.deleteWorkflow(state.yml, workflowId),
        };
      });
    },
    deleteWorkflowFromChain(workflowId, chainedWorkflowIndex, placement) {
      return set((state) => {
        const copy = deepCloneSimpleObject(state.yml);

        if (!copy.workflows?.[workflowId]?.[placement]) {
          return state;
        }

        copy.workflows[workflowId] = WorkflowService.deleteChainedWorkflowByPlacement(
          copy.workflows[workflowId],
          chainedWorkflowIndex,
          placement,
        );

        return { yml: copy };
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
