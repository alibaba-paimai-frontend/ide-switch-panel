import Chance from 'chance';
const chance = new Chance();

export function panelGen(id = chance.word()) {
  return { id: id, title: id, type: 'editor' };
}

export function modelPropsGen() {
  const ids = [chance.word(), chance.word(), chance.word()];
  const panels = [panelGen(ids[0]), panelGen(ids[1]), panelGen(ids[2])];
  panels[0].type = 'iframe';
  return {
    selectedIndex: chance.pick([0, 1, 2]),
    panels: panels,
    width: 400, 
    height: 200
  };
}

export function getRandomUrl() {
  return chance.pick(['//daxue.taobao.com/markets/daxue/help', '//baidu.com'])
}
