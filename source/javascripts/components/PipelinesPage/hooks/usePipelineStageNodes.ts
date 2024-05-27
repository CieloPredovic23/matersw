import { Node, Position } from 'reactflow';
import { Pipeline, Stage, Stages } from '../PipelinesPage.types';
import { CANVAS_PADDING, STAGE_GAP, STAGE_WIDTH } from '../PipelinesPage.const';
import usePipelineStages from './usePipelineStages';

const commonNodeProps: Partial<Node> = {
  draggable: false,
  connectable: false,
  sourcePosition: Position.Left,
  targetPosition: Position.Right,
};

const runNode = (id: string, x: number): Node => ({
  id: `run-${id}`,
  type: 'run',
  data: undefined,
  position: { x, y: CANVAS_PADDING + 14 },
  ...commonNodeProps,
});

const addNode = (id: string, x: number): Node => ({
  id: `add-${id}`,
  type: 'add',
  data: undefined,
  position: { x, y: CANVAS_PADDING + 14 },
  ...commonNodeProps,
});

const stageNode = (id: string, x: number, stage: Stage) => ({
  id,
  type: 'stage',
  data: stage,
  position: { x, y: CANVAS_PADDING },
  ...commonNodeProps,
});

function* nodeGenerator(stages: Stages): Iterable<Node> {
  const entries = Object.entries(stages);

  let x = CANVAS_PADDING;

  for (let i = 0; i < entries.length; i++) {
    const [id, stage] = entries[i];

    if (i === 0) {
      yield runNode(id, x);
      x += 24 + STAGE_GAP;
    } else {
      yield addNode(id, x);
      x += 24 + STAGE_GAP;
    }

    yield stageNode(id, x, stage);

    x += STAGE_WIDTH + STAGE_GAP;

    // NOTE: I'm not sure this is necessary or not...
    if (i === entries.length - 1) {
      yield addNode('add-new', x);
    }
  }
}

const usePipelineStageNodes = (pipeline?: Pipeline, stages?: Stages): Node[] => {
  const pipelinesStages = usePipelineStages(pipeline, stages);
  return Array.from(nodeGenerator(pipelinesStages));
};

export default usePipelineStageNodes;
