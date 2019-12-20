export function getRedirecTo (type, header){
    let path
    if(type === 'boss') {
        path = '/boss'
    } else {
        path ='/staff'
    }
    if (!header) {
        path += 'info'
    }
    return path
}