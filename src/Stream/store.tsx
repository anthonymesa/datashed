
import { create } from 'zustand';
import type { StreamStore, Datum } from './types';
import { v4 as uuidv4  } from 'uuid';
import { loremIpsum } from "lorem-ipsum";

const initialUuid = uuidv4();

const defaultDatum: Datum = {
  id: initialUuid,
  title: loremIpsum(),
  description: loremIpsum(),
  created: Date.now(),
  edited: null,
  parentId: null,
}

const useStore = create<StreamStore>()((set) => ({
  data: { [initialUuid]: defaultDatum },
  rootIds: [initialUuid]
}))

export default useStore;
