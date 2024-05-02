import NavigationLink from "@/components/NavigationLink";

// UI for not founded pages
//
// not using '/not-found.tsx' because it's redirects a page instead of rendering it
export default function NotFound() {
  return (
    <div className='bg-main flex-auto flex flex-col items-center justify-center gap-5'>
      <div className='flex flex-col items-center'>
        <p className='text-xl font-bold'>Error: 404</p>
        <p className='text-xl'>Opps... Looks like this page doesn't exist!</p>
      </div>
      <div className='flex flex-row items-center gap-3'>
        <p>Go to </p>
        <NavigationLink 
          href='/' 
          className='p-2 bg-teal-600 hover:bg-indigo-400 transition rounded-xl text-white outline-2'
        >
          Home page
        </NavigationLink>
      </div>
    </div>
  )
}
