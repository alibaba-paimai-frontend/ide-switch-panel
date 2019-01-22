import Chance from 'chance';
const chance = new Chance();

export function panelGen(id = chance.word()) {
  return { id: id, title: id };
}

export function modelPropsGen() {
  const ids = [chance.word(), chance.word(), chance.word()];
  const panels = [panelGen(ids[0]), panelGen(ids[1]), panelGen(ids[2])];
  return {
    selectedPanelId: chance.pick(panels).id,
    panels: panels
  };
}
