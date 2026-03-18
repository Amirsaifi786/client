import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API, { IMAGE_URL } from "../api/axios";
import { toast } from "react-toastify";
import "./Roomdetail.css";

const PropertyDetail = () => {

const { slug } = useParams();

const [property,setProperty] = useState(null);
const [images,setImages] = useState([]);
const [video,setVideo] = useState(null);
const [activeIndex,setActiveIndex] = useState(0);

const [message,setMessage] = useState(
"I am interested in this property and I would like to know more details."
);

useEffect(()=>{

const fetchProperty = async ()=>{

try{

const res = await API.get(`/property/slug/${slug}`);

setProperty(res.data);
setVideo(res.data.video);

let rawImages = res.data.images;
let parsedImages = [];

if(typeof rawImages === "string"){
try{
parsedImages = JSON.parse(rawImages);
}catch{
parsedImages = [rawImages];
}
}else if(Array.isArray(rawImages)){
parsedImages = rawImages;
}

setImages(parsedImages);

}catch(error){
console.log(error);
}

};

fetchProperty();

},[slug]);

const nextImage = ()=>{
setActiveIndex((prev)=>(prev+1)%images.length);
};

const prevImage = ()=>{
setActiveIndex((prev)=>prev===0?images.length-1:prev-1);
};

const sendMessage = async () => {
  try {
    await API.post("/message/send-message", {
      property_id: property.id,
      message,
    });
    toast.success("Message sent successfully!");
  } catch (error) {
    console.log(error);
    toast.error("Failed to send message.");
  }
};

const toggleBookmark = async ()=>{

try{

await API.post(`/bookmark/update-bookmark/${property.id}`);

setProperty(prev=>({
...prev,
bookmark: prev.bookmark === 1 ? 0 : 1
}));

}catch(error){
console.log(error);
}

};

if(!property) return <h3 className="text-center mt-5">Loading...</h3>;

return(
<div className="container detail-container py-5">

{/* HERO SECTION */}

<div className="hero-section mb-5">

<img
src={
images.length>0
?`${IMAGE_URL}/${images[activeIndex]}`
:"https://via.placeholder.com/1200x600"
}
className="hero-img"
alt={property.title}
/>

<div className="hero-content">

<h2>{property.title}</h2>

<p>
<i className="fa fa-map-marker-alt me-2"></i>
{property.address}
</p>

</div>

{images.length>1 &&(
<>
<button onClick={prevImage} className="gallery-btn left">❮</button>
<button onClick={nextImage} className="gallery-btn right">❯</button>
</>
)}

</div>

{/* THUMBNAILS */}

<div className="thumb-row mb-5">

{images.map((img,index)=>(
<img
key={index}
src={`${IMAGE_URL}/${img}`}
className={`thumb ${activeIndex===index?"active":""}`}
onClick={()=>setActiveIndex(index)}
alt=""
/>
))}

</div>

{/* VIDEO */}

{video &&(

<div className="video-section mb-5 text-center">

<h4 className="section-title">Video Walkthrough</h4>

<div className="video-card">

<video controls>

<source
src={`${IMAGE_URL}/${video}`}
type="video/mp4"
/>

</video>

</div>

</div>

)}

<div className="row">

{/* LEFT */}

<div className="col-lg-8">

<div className="card shadow-sm mb-4">

<div className="card-body">

<h4 className="mb-4">Property Details</h4>

<div className="row">

<div className="col-md-4 mb-3">
<strong>Offer Type</strong>
<p>{property.offerType}</p>
</div>

<div className="col-md-4 mb-3">
<strong>Property Type</strong>
<p>{property.propertyType}</p>
</div>

<div className="col-md-4 mb-3">
<strong>Rooms</strong>
<p>{property.rooms}</p>
</div>

<div className="col-md-4 mb-3">
<strong>Bathrooms</strong>
<p>{property.bathrooms}</p>
</div>

<div className="col-md-4 mb-3">
<strong>Parking</strong>
<p>{property.parking || "No"}</p>
</div>

<div className="col-md-4 mb-3">
<strong>Meals</strong>
<p>{property.meals || "Not Included"}</p>
</div>

</div>

</div>

</div>

                    {property.propertyType === "PG" && (
                        <div className="card mb-4 shadow-sm">
                            <div className="card-body">
                                <h4 className="mb-3">Pricing for PG</h4>
                                <ul className="list-group">
                                    {/* Hum check kar rahe hain ki price exist kare aur 0 na ho */}
{property.singlePrice > 0 && (
  <li className="list-group-item">
    Single Sharing : ₹{property.singlePrice}
  </li>
)}

{property.doublePrice > 0 && (
  <li className="list-group-item">
    Double Sharing : ₹{property.doublePrice}
  </li>
)}

{property.triplePrice > 0 && (
  <li className="list-group-item">
    Triple Sharing : ₹{property.triplePrice}
  </li>
)}
                                </ul>
                            </div>
                        </div>
                    )}

<div className="card shadow-sm">

<div className="card-body">

<h4>Description</h4>

<p
dangerouslySetInnerHTML={{
__html: property.description
}}
></p>

</div>

</div>

</div>

{/* RIGHT */}

<div className="col-lg-4">

<div className="price-card mb-4">

<h2>
₹{
property.price ||
property.singlePrice ||
property.doublePrice ||
property.triplePrice
}
</h2>

<span>Monthly Rent</span>

<i
className={`fa fa-star bookmark ${
property.bookmark?"active":""
}`}
onClick={toggleBookmark}
/>

</div>

<div className="contact-card">

<h5>Contact Owner</h5>

<div className="owner">

<i className="fa fa-user-circle"></i>

<p>{property.owner_name}</p>

</div>

<a
href={`tel:${property.phone}`}
className="btn btn-success w-100 mb-3"
>
<i className="fa fa-phone me-2"></i>
{property.phone}
</a>

<textarea
className="form-control mb-3"
rows="4"
value={message}
onChange={(e)=>setMessage(e.target.value)}
/>

<button
className="btn btn-primary w-100"
onClick={sendMessage}
>
Send Message
</button>

</div>

</div>

</div>

</div>

);

};

export default PropertyDetail;