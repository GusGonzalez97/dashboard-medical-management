export type Mapper = Record<string, string>;
  
  export const textMapper = (text: string, dictionary: Mapper, returnDefault?: boolean): string => {
    if (!text && !dictionary) return '';
    if (!text) return dictionary.default;
    if (!dictionary) return text;
    const textMapped = dictionary[text];
  
    return textMapped ?? returnDefault ? dictionary.default : text;
  };
  