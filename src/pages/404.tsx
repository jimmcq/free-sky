import ColorSkycons, { ColorSkyconsType } from 'react-color-skycons'
import styles from './404.module.css'

function Custom404() {
    return (
        <div className={styles.container}>
            <p>
                <span className={styles.statusCode}>404</span> This page could not be found.
            </p>
            <ColorSkycons className={styles.icon} type={ColorSkyconsType.FOG} animate={true} size={375} resizeClear={true} />
        </div>
    )
}

export default Custom404
