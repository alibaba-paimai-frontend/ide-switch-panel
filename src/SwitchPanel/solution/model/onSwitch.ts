// import { getValueByPath } from 'ide-lib-utils';
import { IStoresEnv } from 'ide-lib-base-component';
import { IStoresModel } from 'ide-lib-engine';
import { IPanel } from '../../mods/Panel';
// import { RPATH } from '../../router/helper'

/**
 * 显示 list 列表项
 * @param env - IStoresEnv
 */
export function switchPanel(env: IStoresEnv<IStoresModel>){
    return (panel: IPanel, index: number) => {
        const { stores, client } = env;
        stores.model.setSelectedIndex(index);
    }
}