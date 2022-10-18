export function getTypeString(typeCode){
  switch(typeCode){
  case 1:
    return "";
  }
}
export function verifyFileType(file, types) {
  let type = file.type.split("/")[1];
  if (!types.includes(type)) {
    return false;
  }

  return true;
}