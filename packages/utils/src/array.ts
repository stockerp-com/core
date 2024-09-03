interface ArrayObjectsChangeResult<T> {
  deletedData: T[];
  updatedData: { item: T; oldIndex: number; newIndex: number }[];
  newData: { item: T; index: number }[];
}

export function trackArrayObjectsChanges<T>(
  oldArray: T[],
  newArray: T[],
  primaryKeys: (keyof T)[],
  trackIndexes: boolean = false,
): ArrayObjectsChangeResult<T> {
  const deleted: T[] = [];
  const updated: { item: T; oldIndex: number; newIndex: number }[] = [];
  const newItems: { item: T; index: number }[] = [];

  const createKey = (item: T) =>
    primaryKeys
      .map((pk) => {
        const value = item[pk];
        if (Array.isArray(value)) {
          return value
            .map((v) => JSON.stringify(v))
            .sort()
            .join(',');
        }
        return JSON.stringify(value);
      })
      .join('|');

  const oldMap = new Map<string, { item: T; index: number }>();
  const newMap = new Map<string, { item: T; index: number }>();

  oldArray.forEach((item, index) => {
    oldMap.set(createKey(item), { item, index });
  });

  newArray.forEach((item, index) => {
    newMap.set(createKey(item), { item, index });
  });

  oldMap.forEach((value, key) => {
    if (!newMap.has(key)) {
      deleted.push(value.item);
    } else {
      const newItem = newMap.get(key)!;
      if (trackIndexes) {
        if (
          JSON.stringify(value.item) !== JSON.stringify(newItem.item) ||
          value.index !== newItem.index
        ) {
          updated.push({
            item: newItem.item,
            oldIndex: value.index,
            newIndex: newItem.index,
          });
        }
      } else {
        if (JSON.stringify(value.item) !== JSON.stringify(newItem.item)) {
          updated.push({
            item: newItem.item,
            oldIndex: value.index,
            newIndex: newItem.index,
          });
        }
      }
    }
  });

  newMap.forEach((value, key) => {
    if (!oldMap.has(key)) {
      newItems.push({ item: value.item, index: value.index });
    }
  });

  return { deletedData: deleted, updatedData: updated, newData: newItems };
}
