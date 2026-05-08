import styles from './SearchBar.module.css';

function SearchBarComponent ({value, onChange, placeholder}) {

    return (
        <div className={styles["search-container"]}>
            <input 
                type="text" 
                className={styles["search-box"]}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
        </div>
    )

}

export default SearchBarComponent