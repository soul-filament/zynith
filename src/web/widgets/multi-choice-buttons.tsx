import {Button} from 'flowbite-react'

export interface MultiChoiceButtonProps {
    selected: string
    options: string[]
    onSelect: (item: string) => void 
}


export function MultiChoiceButton (props: MultiChoiceButtonProps) {
    return (
        <Button.Group className='h-8'>
            {
                props.options.map((o) => {
                    return (
                        <Button 
                            className='capitalize' 
                            color="gray" 
                            size={"sm"} 
                            key={o} 
                            gradientDuoTone={`${props.selected === o ? 'purpleToBlue' : ''}`} 
                            onClick={() => props.onSelect(o)}>
                                {o}
                        </Button>
                    )
                })
            }
        </Button.Group>
    )
}