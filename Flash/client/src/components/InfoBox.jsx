import InfoBox_Nav from './InfoBox_Nav';
import InfoBox_Body from './InfoBox_Body';




const InfoBox = () => {

    return (
        <div className="infoBox bg-zinc-300 grid-15-85">
            <InfoBox_Nav />
            <InfoBox_Body />

        </div>
    );
}

export default InfoBox;