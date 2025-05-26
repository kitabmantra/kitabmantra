import React from 'react'

interface MListBookProps {
    userId: string;
}
const MListBook = ({
    userId
}: MListBookProps) => {
    console.log(userId)
    return (
        <div>
            this is the mobile view for listing of books!
        </div>
    )
}
export default MListBook
