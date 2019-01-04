// Copyright (c) 2018, frappe and contributors
// For license information, please see license.txt

frappe.ui.form.on('Gate Entry', {
	refresh: function(frm) {

	}
});

frappe.ui.form.on('Gate Entry', {
	"type_of_vehicle": function(frm) {
		frm.set_value("person_name","");
		frm.set_value("contact_number","");
		frm.set_value("vehicle_number","");
		frm.set_value("driver_name","");
	}
});

frappe.ui.form.on("Gate Entry", "onload", function(frm) {
    cur_frm.set_query("po_no", function() {
        return {
            "filters": {
                "project_site": frm.doc.project_site_name
            }
        };
    });
});

frappe.ui.form.on('Gate Entry', {
	"edit_po_date": function(frm) {
		if (frm.doc.edit_po_date == 1){
			frm.set_df_property("posting_date","read_only",0);
			frm.set_df_property("posting_time","read_only",0);
		}
		else{
			frm.set_df_property("posting_date","read_only",1);
			frm.set_df_property("posting_time","read_only",1);
		}
	}
});

frappe.ui.form.on('Gate Entry', {
	"gate_entry_type": function(frm) {
		if (frm.doc.gate_entry_type == "Rejection"){
			frm.set_df_property("po_no_manual","reqd",1);
			frm.set_df_property("purchase_receipt_no","reqd",1);
		}
		else{
			frm.set_df_property("po_no_manual","reqd",0);
			frm.set_df_property("purchase_receipt_no","reqd",0);
		}
	}
});

frappe.ui.form.on('Gate Entry', {
	"gate_entry_type": function(frm) {
		frm.set_value("po_no","");
		frm.set_value("po_no_manual","");
		frm.set_value("purchase_receipt_no","");
		frm.set_value("po_date","");
		frm.set_value("supplier_name","");
		if (frm.doc.po_no == ""){
			cur_frm.clear_table("gate_entry_items");
	               	frm.refresh_field("gate_entry_items");
		}
	}
});

cur_frm.add_fetch("po_no","transaction_date","po_date")
cur_frm.add_fetch("po_no_manual","transaction_date","po_date")
cur_frm.add_fetch("po_no","supplier","supplier_name")
cur_frm.add_fetch("po_no_manual","supplier","supplier_name")

frappe.ui.form.on("Gate Entry", {
    "po_no": function(frm) {
	if (frm.doc.po_no!= ""){
        	frappe.model.with_doc("Purchase Order", frm.doc.po_no, function() {
		cur_frm.clear_table("gate_entry_items");
            		var tabletransfer= frappe.model.get_doc("Purchase Order", frm.doc.po_no)
            		$.each(tabletransfer.items, function(index, row){
                		var d = frm.add_child("gate_entry_items");
				console.log(row.item_code)
                		d.item_code = row.item_code;
				d.item_name = row.item_name;
				d.qty = row.qty;
				d.uom = row.uom;
				d.description = row.description;
                	frm.refresh_field("gate_entry_items");
            });
        });
    }
}
});
