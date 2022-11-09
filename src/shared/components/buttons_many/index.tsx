import React from 'react'

interface IButtonMany{
    list: string[],
    active: number
}
interface IButtonManyProps{
    elements: IButtonMany,
    themeLight?: boolean,
    setActive:( value: number)=>void,
    disableds?: number[]
}

const ButtonMany:React.FC<IButtonManyProps> = ({elements,setActive, themeLight, disableds}) => {

    function handleActive(index: number) {
        setActive(index)
    }

    return (
        <div>
            {
                elements.list.map((e, index) => {
                    return (
                        <button type='button' disabled={disableds?.includes(index)} key={index} onClick={() =>handleActive(index)} className={`btn rounded-pill ${(elements.active === index)?'text-bg-dark':`${themeLight?'text-dark':'text-white'} border border-dark`} me-2 mb-2`} >
                            {e}
                        </button>
                    )
                })
            }

        </div>
    )
}

export default ButtonMany