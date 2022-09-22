const itemName = 'imagenes';
const read = () => {
    const store = localStorage.getItem(itemName);
    return store ? JSON.parse(store) : [];
}
const write = (content) => {
    localStorage.setItem(itemName, JSON.stringify(content));
}
const destroy = (id) => {
    const store = read();
    const newStore = store.filter(item => item.id !== id);
    write(newStore);
}


export{
    read,
    write,
    destroy
}