import TopNavBar from '@/components/Navbar';

export default function UserPage({ isDisplayingFaculty }) {
    return (
        <>
           <TopNavBar />
           {isDisplayingFaculty ?  <h1>Teachers</h1> : <h1>Students</h1>}
        </>
    )
}