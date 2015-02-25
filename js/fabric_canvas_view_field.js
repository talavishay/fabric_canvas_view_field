jQuery(document).ready(function(){
	jQuery('.node-form ').submit(function(ev) {
	//TODO: move to form alter ?
	// node form -- export canvas before to canvas field
		ev.preventDefault(); 
		_save();
		this.submit();
	}); 
	add_tools();
});
function init(canvas) {
	init_fabric();
	
	var ref = new fabric.Canvas(canvas.id);
	jQuery('#'+canvas.id)[0].fabric = ref;
	
	jQuery(ref.wrapperEl).addClass("activated active")
		.on("mouseenter click", function activateCanvas(e){
			jQuery(".canvas-container").removeClass("active");
			jQuery(ref.wrapperEl).addClass("active");
		});
		
	var w = parseInt(canvas.canvas_profile.width),
		h = parseInt(canvas.canvas_profile.height),
		s = parseFloat(canvas.canvas_profile.scale);
	if(typeof(w) === "number" && typeof(h) === "number" ){					
			ref.setWidth(w * s);
			ref.setHeight(h * s);
	}
	if(typeof canvas.json === "object" || typeof canvas.json === "string" ){
		ref.loadFromJSON(canvas.json, function(){
					ref.renderAll();
					}, function(o, object){
					//o.clipTo.replace(/width/i, o.width);
					});
	} else{ 
			add_rect(ref, _get_random_object_options(canvas));
			ref.renderAll();
	}
	//return ref;
}
//function _init(){
	//Drupal.settings.fabric_view = Drupal.settings.fabric_view || { 'settings': {}, 'behaviors': {}, 'canvas_instances': {} };
	//Drupal.settings.canvas_view = {
		//getActiveCanvas : function(){
			//if(Drupal.settings.canvas_view._active){
					//return Drupal.settings.canvas_view._active;
			//}
			//if(typeof Drupal.settings.canvas_view_field_data.activated === "boolean" ){
					//Drupal.settings.canvas_view.active =  Drupal.settings.canvas_view_field_data;
			//}
			//jQuery.each(Drupal.settings.canvas_view_field_data, function(i, val){
				//if( val.activated && val.active != false){
					//Drupal.settings.canvas_view.active =  val;
				//}
			//});
			//return Drupal.settings.canvas_view.active.ref;
		
		//},
		//current_node : 1,
		//fields : Array(),
		//load_field : function _load(){
				//var g = Drupal.settings.canvas_view.getActiveCanvas();
					
				//jQuery.ajax({
				//url : "/load_canvas_field_handler/"+Drupal.settings.canvas_view.current_node+'/0',
				//type : "POST",
				//data : {
					//"nid"			:	g.lowerCanvasEl.dataset.entityId,
				//},
				//success : function(d){
					//console.log(d);
				//}
			//});
	//} 
	//};
	
//}
Drupal.behaviors.fabric_canvas_view_field = {
	attach: function (context, settings) {
		jQuery("canvas", context).once("fabric_canvas_view_field", function(){
			jQuery(settings.canvas_view_field_data).each(function(i, val){
				 init(val);
			});
		});
	}
}
