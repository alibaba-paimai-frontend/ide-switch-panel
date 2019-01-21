import Chance from 'chance';
const chance = new Chance();

export function modelPropsGen() {
  const ids = [chance.word(), chance.word(), chance.word()];
  const panels = [
    { id: ids[0], title: ids[0] },
    { id: ids[1], title: ids[1] },
    { id: ids[2], title: ids[2] }
  ];
  return {
    selectedPanelId: chance.pick(panels).id,
    panels: panels
  };
}
