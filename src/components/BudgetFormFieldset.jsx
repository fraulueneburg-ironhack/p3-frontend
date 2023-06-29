function BudgetFormFieldset(props) {
    const currency = props.data.currency
    const dataName = Object.keys(props.data)[props.index]
    const dataArr = props.data[dataName]

    return (
        <fieldset id={dataName}>
            <legend>All your {dataName}</legend>
            {dataArr.map((item, index) => (
                <div key={index} className="grid">
                    <label>{item.name}</label>
                    <input type="number" min="0" placeholder={item.amount} /*value={item.amount}*/ name={item.name} onChange={(e) => props.handleChange(e, index)} />
                    <span className="currency">{`${currency}`}</span>
                    <button className="btn-delete-item" /*onSubmit={addItem}*/>–</button>
                </div>
            ))}

            <div key="9999" className="grid">
                <input type="text" name="newItemName" onChange={(e) => props.handleChange(e)} placeholder="name" />
                <input type="number" min="0" placeholder="0" name="newItemAmount" onChange={(e) => props.handleChange(e)} />
                <span className="currency">{`${currency}`}</span>
                <button className="btn-add-item" /*onSubmit={addItem}*/>+</button>
            </div>
            {/* <strong style={{ textAlign: 'right', display: 'block' }}>
                SUM:&nbsp;
                {dataArr.reduce((acc, item, i, arr) => {
                    return acc + item.amount;
                }, 0)}
                {`${currency}`}
            </strong> */}
        </fieldset>
    )
}

export default BudgetFormFieldset
