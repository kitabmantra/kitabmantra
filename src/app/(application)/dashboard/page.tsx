import PostBookPage from "@/components/elements/desktop/forms/BookForm"
import { getBooks } from "@/lib/actions/books/get/getBooksByUser"
import { getUserById } from "@/lib/actions/user/get/getUser";

const Page = async () => {
    const books = await getBooks();
    const user = await getUserById();
    console.log("User : ",user)
    console.log("Book : ",books)
    return (
        <div>
            hello from remote vscode, works well, is real time..
            <PostBookPage />
        </div>
    )
}
export default Page