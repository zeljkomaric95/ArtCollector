import React, { useEffect, useState } from "react";

/**
 * Don't touch these imports!
 */
import {
  fetchAllCenturies,
  fetchAllClassifications,
  fetchQueryResults,
} from "../api";

const Search = ({ setIsLoading, setSearchResults }) => {
  // Make sure to destructure setIsLoading and setSearchResults from the props

  /**
   * We are at the Search component, a child of app. This has a form, so we need to use useState for
   * our controlled inputs:
   *
   * centuryList, setCenturyList (default should be an empty array, [])
   * classificationList, setClassificationList (default should be an empty array, [])
   * queryString, setQueryString (default should be an empty string, '')
   * century, setCentury (default should be the string 'any')
   * classification, setClassification (default should be the string 'any')
   */
  const [centuryList, setCenturyList] = useState([]);
  const [classificationList, setClassificationList] = useState([]);
  const [queryString, setQueryString] = useState("");
  const [century, setCentury] = useState("any");
  const [classification, setClassification] = useState("any");

  /**
   * Inside of useEffect, use Promise.all([]) with fetchAllCenturies and fetchAllClassifications
   *
   * In the .then() callback pass the returned lists to setCenturyList and setClassificationList
   *
   * Make sure to console.error on caught errors from the API methods.
   */
  useEffect(() => {
    Promise.all([fetchAllCenturies(), fetchAllClassifications()]).then(
      ([allCenturiesResults, allClassificationsResults]) => {
        try {
          console.log(allCenturiesResults)
          setClassificationList(allClassificationsResults);
          setCenturyList(allCenturiesResults);
        } catch (err) {
          console.error("Uh oh! Problems with Promises");
        }
      }
    );
  }, []);

  /**
   * This is a form element, so we need to bind an onSubmit handler to it which:
   *
   * calls event.preventDefault()
   * calls setIsLoading, set it to true
   *
   * then, in a try/catch/finally block:
   *
   * try to:
   * - get the results from fetchQueryResults({ century, classification, queryString })
   * - pass them to setSearchResults
   *
   * catch: error to console.error
   *
   * finally: call setIsLoading, set it to false
   */

  return (
    <form
      id="search"
      onSubmit={async (e) => {
        e.preventDefault();
        console.log('is loading now true')
        setIsLoading(true);
        try {
          const results = await fetchQueryResults({
            century,
            classification,
            queryString,
          });
          await setSearchResults(results);
          console.log('This is the try Block')
        } catch (err) {
          console.error(`Search Result Error ${err} in Search.js`);
        } finally {
          setIsLoading(false);
          console.log('This is the finally block')
        }
      }}
    >
      <fieldset>
        <label htmlFor="keywords">Query</label>
        <input
          id="keywords"
          type="text"
          placeholder="enter keywords..."
          value={queryString}
          onChange={(e) => { setQueryString(e.target.value)}}
        />
      </fieldset>
      <fieldset>
        <label htmlFor="select-classification">
          Classification{""}
          <span className="classification-count">
            ({classificationList.length})
          </span>
        </label>
        <select
          name="classification"
          id="select-classification"
          value={classification}
          onChange={(e) => { 
            e.preventDefault();
            setClassification(e.target.value)
           }}
        >
          {/* map over the classificationList, return an <option /> */}
          {classificationList.map((el) => {
            return (<option value={el.name} key={el.id}>{el.name}</option>)
          })}
        </select>
      </fieldset>
      <fieldset>
        <label htmlFor="select-century">
          Century <span className="century-count">({centuryList.length})</span>
        </label>
        <select
          name="century"
          id="select-century"
          value={century}
          onChange={(e) => { 
            e.preventDefault();
            setCentury(e.target.value)
           }}
        >
         {/* map over the centuryList, return an <option /> */}
        {centuryList.map((el) => {
          return (<option value={el.name} key={el.id}>{el.name}</option>)
        })} 
        </select>
      </fieldset>
      <button>SEARCH</button>
    </form>
  );
};

export default Search;