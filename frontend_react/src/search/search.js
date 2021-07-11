function Search(props) {
    const query = new URLSearchParams(window.location.search).get('query');
    console.log(props)
    return (
        <>
            <h1> Search results for {query} </h1>
        </>
    )
}

export default Search