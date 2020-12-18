import React from 'react';
import classes from './Article.module.css';

const article = (props) => {
    return (
        <article className={classes.Article}>{props.children}</article>
    );
}

export default article;