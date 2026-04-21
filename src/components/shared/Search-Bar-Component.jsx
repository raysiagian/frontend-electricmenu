import styles from './SearchBar.module.css';

function SearchBarComponent ({value, onChange, placeholder}) {

    return (
        <div className={styles.SearchContainer}>
            <input 
                type="text" 
                className={styles.searchBox}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
        </div>
    )

}

export default SearchBarComponent