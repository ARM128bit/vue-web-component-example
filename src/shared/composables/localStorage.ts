export default function useLocalStorage() {

  const getValue = <T>(key: string): T | null => {
    let value: T | null = null;
    try {
      const strValue = localStorage.getItem(key);
      console.log(strValue)
      value = strValue ? JSON.parse(strValue) : strValue;
    } catch (e) {
      console.error(e);
    }
    return value;
  };

  const saveValue = (key: string, value: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(e);
    }
  };

  return {
    getValue,
    saveValue,
  };
}
