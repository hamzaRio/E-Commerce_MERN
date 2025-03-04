import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useCart } from '../context/Cart/CartContext';

interface Props {
  _id: string;  // This is just a placeholder, replace with your own unique ID for each product.
  title: string;
  image: string;
  price: number;
}


export default function ProductCard({_id,title, image, price}:Props) {
  const { addItemToCart } = useCart();
  return (
    <Card >
      <CardMedia
        sx={{ height: 200 }}
        image={image}
        title="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {price} MAD
        </Typography>
      </CardContent>
      <CardActions>
        <Button variant='contained' size="small" onClick={()=> addItemToCart(_id)}>Add To Card</Button>
      </CardActions>
    </Card>
  );
}

