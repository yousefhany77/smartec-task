import classes from "./loader.module.css";
function Loader() {
  return (
    <span className={classes.spinner}>
      <svg viewBox="25 25 50 50">
        <circle r="20" cy="50" cx="50"></circle>
      </svg>
    </span>
  );
}

export default Loader;
