import userImages from '../Assets/images/user.svg'

//* remove special character
const removeSpecialCharacter = (str: string) =>
  // eslint-disable-next-line no-useless-escape
  str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, '')

//* sử lý nameId
export const getIdFromNameId = (nameId: string) => {
  const arr = nameId.split('-i-')
  return arr[arr.length - 1]
}

/*
 * cải thiện url để nó thân thiện hơn với SEO bằng các ghép tên của product vào id cho url
 * remove special character of product name and change them by "-" + product id
 * then, remove it => new URL
 */
export const generateNameId = ({ name, id }: { name: string; id: string }) => {
  return removeSpecialCharacter(name).replace(/\s/g, '-') + `-i-${id}`
}

//* Get url avatar of user
export const getAvatarUrl = (avatarName?: string) => {
  return avatarName ? `https://api-ecom.duthanhduoc.com/images/${avatarName}` : userImages
}
