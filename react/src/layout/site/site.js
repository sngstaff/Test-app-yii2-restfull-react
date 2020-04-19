import React from 'react';

import './site.css';

function Site(children) {
    return (
        <>
        <main className="site__page" style={ { backgroundImage: "url('/static/images/main.jpg')" } }>
            <div className="site__page-inner">
                <div className="site__page-body">
                    { children }
                </div>
            </div>

            <aside className="site__inc text-center">
                &copy; { new Date().getFullYear() }
            </aside>
        </main>
        </>
    )
}

export { Site }