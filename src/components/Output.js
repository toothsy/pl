import React from 'react'
import loader from '../svgs/loader.svg'
const Output=({canvasCtx,isLoading,setLoading})=> {
		const loader2=()=>{
			return (
				<>
				<div class="loadingio-spinner-rolling-44atop6hkx6">
					<div class="ldio-dtksj1r293u">
					<div></div>
				</div></div>
</>
			)
		}
	return (
		<figure>
			<canvas className="output_canvas" ref={canvasCtx} width="1200px" height="600px">
			</canvas>
		</figure>
	)
}

export default Output;