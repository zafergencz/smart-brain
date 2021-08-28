import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({imageUrl, box}) =>{
	return(		
		<div className='center ma'>
			<div className= 'absolute mt2'>
				<img id = 'inputImage' alt= '' src={imageUrl} width= '500px' height= 'auto' />
				<div>
					{
							box.map((value,index) => {
								return (
									<div key = {index} className = 'bounding_box' style= {{top: value.topRow, left: value.leftCol, right: value.rightCol, bottom: value.bottomRow}} ></div>
								)
							})
						
					}
				</div>
				
			</div>
		</div>
	);	
}

export default FaceRecognition;