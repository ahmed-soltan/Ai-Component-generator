import { parseAsBoolean, useQueryState } from "nuqs"

export const useContactModal = () =>{
    const [isOpen , setIsOpen] = useQueryState("contact" , 
        parseAsBoolean.withDefault(false)
    )

    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);

    return { isOpen, open, close };
}