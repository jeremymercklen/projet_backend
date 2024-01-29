module.exports = class Item {
    constructor(id, label, quantity, checked, idList) {
        this.id = id
        this.label = label
        this.quantity = quantity
        this.checked = checked
        this.idList = idList
    }
}