import React,{useEffect,useRef,useState} from 'react';
import './styles/index.css';
import {Pose} from "@mediapipe/pose"
import {Camera} from "@mediapipe/camera_utils"
import {drawConnectors} from "@mediapipe/drawing_utils"
import {drawLandmarks} from "@mediapipe/drawing_utils"
import {POSE_CONNECTIONS} from "@mediapipe/pose"
import Output from './components/Output';

function App() {
	let  videoElement = useRef(null),
		app = useRef(null)
		,canvasElement = useRef(null);
	let canvasCtx;
	// const [isLoading , setLoading] = useState(false);
	const  onResults=(results)=>{
		canvasCtx = canvasElement.current.getContext('2d');	
		    canvasCtx.save();
		    canvasCtx.clearRect(0, 0, canvasElement.current.width, canvasElement.current.height);
		    canvasCtx.drawImage(
			    results.image, 0, 0, canvasElement.current.width, canvasElement.current.height);
			    drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
			    {color: '#00FF00', lineWidth: 4});
			    drawLandmarks(canvasCtx, results.poseLandmarks,
			    {color: '#FF0000', lineWidth: 2}
		    );
		    let x1,x2,x3,y1,y2,y3;
		    
		    if(results.poseLandmarks!==undefined){
			    // console.log([results.poseLandmarks[25].visibility.toFixed(2)]);
			    let right = results.poseLandmarks[25].visibility.toFixed(2)===1.0
			    if(right){
				    x1=results.poseLandmarks[11].x;y1=results.poseLandmarks[11].y;
				    x2=results.poseLandmarks[23].x;y2=results.poseLandmarks[23].y;
				    x3=results.poseLandmarks[25].x;y3=results.poseLandmarks[25].y;
			    }
			    else{
				    x1=results.poseLandmarks[12].x;y1=results.poseLandmarks[12].y;
				    x2=results.poseLandmarks[24].x;y2=results.poseLandmarks[24].y;
				    x3=results.poseLandmarks[26].x;y3=results.poseLandmarks[26].y;

			    }
			    let area = 0.5*(x1*(y2-y3)+x2*(y3-y1)+x3*(y1-y2))
			    console.log(Math.abs(area.toFixed(3))<=0.001)
		    }
		    canvasCtx.restore();
    }
	useEffect(() => {
		videoElement.current = document.getElementsByClassName('input_video')[0];
		canvasElement.current = document.getElementsByClassName('output_canvas')[0];
		
		   
	}, [])
	app.current.pose = new Pose({locateFile: (file) => {
		return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
	   }});

	   videoElement.current.camera = new Camera(videoElement.current, {
		onFrame: async () => await app.current.pose.send({image: videoElement.current}) ,
		width: 1200,
		height: 600
	   });
	   videoElement.current.camera.start();
	const clickHandle=()=>{

		canvasElement.current.style.display="block"
		videoElement.current.style.display="none"
		   app.current.pose.setOptions({
		     upperBodyOnly: false,
		     smoothLandmarks: true,
		     minDetectionConfidence: 0.5,
		     minTrackingConfidence: 0.5
		   });
		   app.current.pose.onResults(onResults);

	}
	const clickHandleStop= async ()=>{
		app.current.pose.close()
		try{app.current.pose.close()	}
		catch(e){				}
		canvasElement.current.style.display="none"
		videoElement.current.style.display="block"
	}
  return (
    <div className="App" ref={app}>
          <video className="input_video" ref={videoElement}></video>
		<Output canvasCtx={canvasCtx} />
		<button onClick={clickHandle}>start</button>
		<button onClick={clickHandleStop}>stop</button>
    </div>
  );
}

export default App;
