
jQuery(document).ready(function(){

init = function(id, canvas_profile) {
	if(canvas_profile){
		
		init_fabric();
		
		//var canvas = draw_stage(id, canvas_profile),
			var canvas = new fabric.Canvas(id),
			delta = canvas_profile.entityDelta,
			j = Drupal.settings.canvas_view_field_data,
			t = typeof j[delta],
			json = 	( t === "object" ) ? j[delta].json : "";
		
		if(t === "object"){
			canvas.loadFromJSON(json, function(){
				canvas_render();
			}, function(o, object){
				//o.clipTo.replace(/width/i, o.width);
			});
		} else{ 
			//window.setTimeout(function(){
				add_rect(canvas, _get_random_object_options(canvas));
				canvas.renderAll();
			//},0);
		}
		//canvas.on('object:moving', function(e) {
			//var activeObject = e.target;
			//console.log(activeObject.get('left'), activeObject.get('top'));
		//});
		return canvas;
	}
}	

Drupal.behaviors.fabric_canvas_view_field = {
	attach: function (context, settings) {
		// This will only get ran once
			//context.once(function() {
			console.log(context);
		//});
	}
}

Drupal.settings.canvas_view = {
	getActiveCanvas : function(){
		return  Drupal.settings.canvas_view.canvas ;
	},
	current_node : 1,
	fields : Array(),
	load_field : function _load(){
			var g = Drupal.settings.canvas_view.getActiveCanvas();
				
			jQuery.ajax({
			url : "/load_canvas_field_handler/"+Drupal.settings.canvas_view.current_node+'/0',
			type : "POST",
			data : {
				"nid"			:	g.lowerCanvasEl.dataset.entityId,
			},
			success : function(d){
				console.log(d);
			}
		});
} 
};

	// node form -- export canvas before to canvas field
	jQuery('.node-form ').submit(function(ev) {
		ev.preventDefault(); 
		_save();
		this.submit();
		////TODO: multiple instances saving 
	}); 
	var  canvas_selector = "canvas.fabric_canvas_view_field";
	jQuery(canvas_selector).each(function(i, val){
		// initialize fabric on canvas items from the field
		var canvas_profile = jQuery(val).data(),		
			cc = init(val.id, canvas_profile),
			delta = canvas_profile.entityDelta;
		// maintain a list ref for the fabric canvas field items  
		Drupal.settings.canvas_view.fields.push(cc);
		
		jQuery(cc.wrapperEl).on("mouseenter click", function activateCanvas(e){
			canvas = Drupal.settings.canvas_view.canvas  = Drupal.settings.canvas_view.fields[delta];
			Drupal.settings.canvas_view.fields[delta].activated = true;
			console.log(delta);
			
		});
		
		canvas = Drupal.settings.canvas_view.canvas = Drupal.settings.canvas_view.fields[0];
	});
	Drupal.settings.canvas_view.fields[0].activated = true;
	add_tools();
	//}
	_save = function _save(){
		var g = Drupal.settings.canvas_view.getActiveCanvas(),
		nid = g.lowerCanvasEl.dataset.entityId,
		delta = g.lowerCanvasEl.dataset.entityDelta;
		if(jQuery("form.node-form").length >= 1){
			Drupal.settings.canvas_view.fields.forEach(function(val, i){
				if(val.activated){
					var canvas_export = JSON.stringify(val.toJSON());
					jQuery('.fabric_canvas_view_field_json[data-delta="'+i+'"]').val(canvas_export);
				}
			});
		} else {
			jQuery.ajax({
						url : "/save_canvas_field_handler/"+nid+"/"+delta,
						type : "POST",
						data : {
							"nid"			:	nid,
							"layout_data"	: 	canvas_export()
						},
						success : function(d){
							jQuery("#save").css("background-color","green");
							window.setTimeout(function(){
								jQuery("#save").css("background-color","");
							},2000);
							
							console.log(d);
							jQuery(".node-form").submit();
						}
			});
		}
	}	
	
});
