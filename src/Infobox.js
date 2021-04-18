import React from 'react';
import { Card, CardContent, Typography } from "@material-ui/core";
import "./Infobox.css";

function Infobox({title, cases, isRed, total, active, ...props}) {

    return (
        <Card onClick={props.onClick} className={`infobox ${active && 'infobox--selected'} ${isRed && 'infobox--red'}`}>
            <CardContent>
                {/* title  */}
                <Typography className="infobox__title" color="textSecondary">
                    {title}
                </Typography>

                {/* no. of cases  */}
                <h2 className={`infobox__cases ${!isRed && "infobox__cases__green"}`}>{cases}</h2>
                
                {/* total */}
                <Typography className="infobox__total" color="textSecondary">
                    {total} Total
                </Typography>
            </CardContent>
        </Card>
    );
}

export default Infobox;
