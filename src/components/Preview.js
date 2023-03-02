import React from "react";

/**
 * We need to import fetchQueryResultsFromURL since we will sometimes have urls in info.prev and info.next
 * which are query urls.
 */
import { fetchQueryResultsFromURL } from "../api";

const Preview = ({
  setSearchResults,
  setFeaturedResult,
  setIsLoading,
  searchResults,
}) => {
  /**
   * Destructure setSearchResults, setFeaturedResult, and setIsLoading from props
   * and also destructure info and records from props.searchResults
   *
   * You need info, records, setSearchResults, setFeaturedResult, and setIsLoading as available constants
   */

  const info = searchResults.info;
  const records = searchResults.records;

  /**
   * Don't touch this function, it's good to go.
   *
   * It has to be defined inside the Preview component to have access to setIsLoading, setSearchResults, etc...
   */
  async function fetchPage(pageUrl) {
    setIsLoading(true);
    console.log("setting to true");
    try {
      const results = await fetchQueryResultsFromURL(pageUrl);
      console.log(results)
      setSearchResults(results);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      console.log("setting to false");
    }
  }

  return (
    <aside id="preview">
      <header className="pagination">
        {/* This button should be disabled if nothing is set in info.prev, and should call fetchPage with info.prev when clicked */}
        <button
          disabled={info.prev === null}
          className="previous"
          onClick={async () => await fetchPage(info.prev)}
        >
          Previous
        </button>
        {/* This button should be disabled if nothing is set in info.next, and should call fetchPage with info.next when clicked */}
        <button
          disabled={info.next === null}
          className="next"
          onClick={async () => await fetchPage(info.next)}
        >
          Next
        </button>
      </header>
      <section className="results">
        {
          records.map((el) => {
            return ( 
              <div
                key={el.id}
                className="object-preview"
                onClick={async (e) => {
                  e.preventDefault();
                  console.log(el);
                  await setFeaturedResult(el);
                }}
              >
                {el.primaryimageurl ? (
                  <img src={el.primaryimageurl} alt={el.description} />
                ) : (
                  ""
                )}
                {el.title ? <h3>{el.title}</h3> : <h3>MISSING INFO</h3>}
              </div>
            );
          })
          /* Here we should map over the records, and render something like this for each one:
          <div  
            key={ index }
            className="object-preview"
            onClick={(event) => {
              // prevent the default
              // set the featured result to be this record, using setFeaturedResult
            }}>
            { 
              // if the record.primaryimageurl exists, show this: <img src={ record.primaryimageurl } alt={ record.description } />, otherwise show nothing 
            }
            {
              // if the record.title exists, add this: <h3>{ record.title }</h3>, otherwise show this: <h3>MISSING INFO</h3>
            }
          </div>
        */
        }
      </section>
    </aside>
  );
};

export default Preview;