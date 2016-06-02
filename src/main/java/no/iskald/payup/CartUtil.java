package no.iskald.payup;

import com.enonic.xp.content.*;
import com.enonic.xp.data.PropertySet;
import com.enonic.xp.node.NodeId;
import com.enonic.xp.script.bean.BeanContext;
import com.enonic.xp.script.bean.ScriptBean;
import com.enonic.xp.util.Reference;

/**
 * Created by lasse on 01.06.16.
 */
public class CartUtil implements ScriptBean {
    private ContentService contentService;

    public void addToCart(String cartId, Long quantity, String productId) {
        Content cartContent = contentService.getById(ContentId.from(cartId));

        Iterable<PropertySet> itemList = cartContent.getData().getSets("items");

        ContentEditor editor;

        int index = 0;
        boolean existsInCart = false;
        Long currentQuantity = 0L;
        for (PropertySet item : itemList) {
            if (item.getReference("product") != null) {
               if (item.getReference("product").getNodeId().equals(NodeId.from(productId))) {
                   existsInCart = true;
                   currentQuantity = item.getLong("quantity");
                   break;
               }
            }
            index++;
        }

        if (existsInCart) {
            int finalIndex = index;
            Long finalCurrentQuantity = currentQuantity;
            editor = edit -> {
                edit.data.getSet("items", finalIndex).setLong("quantity", finalCurrentQuantity + 1L);
            };
        } else {
            editor = edit -> {
                PropertySet set = new PropertySet();
                set.addReference("product", Reference.from(productId));
                set.addLong("quantity", quantity);
                edit.data.addSet("items", set);
            };
        }



        final UpdateContentParams params = new UpdateContentParams();
        params.contentId( cartContent.getId() );
        params.editor( editor );

        final Content result = this.contentService.update( params );
    }

    @Override
    public void initialize(BeanContext context) {
        this.contentService = context.getService( ContentService.class ).get();
    }
}